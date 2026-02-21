"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

export type SchoolType = "primary" | "secondary" | "higher_secondary" | "combined"

export interface RegisterSchoolInput {
  schoolName: string
  district: string
  taluka: string
  udiseCode?: string
  schoolType: SchoolType
  address?: string
  phone?: string
  email?: string
}

export interface RegisterHeadmasterInput {
  name: string
  email: string
  password: string
  phone?: string
}

export interface RegisterSchoolResult {
  success: boolean
  error?: string
  schoolId?: string
}

export async function registerSchoolWithHeadmaster(
  school: RegisterSchoolInput,
  headmaster: RegisterHeadmasterInput
): Promise<RegisterSchoolResult> {
  try {
    const supabase = createAdminClient()

    // 1. Create school
    const { data: schoolData, error: schoolError } = await supabase
      .from("schools")
      .insert({
        name: school.schoolName.trim(),
        district: school.district.trim(),
        taluka: school.taluka.trim(),
        udise_code: school.udiseCode?.trim() || null,
        type: school.schoolType,
        address: school.address?.trim() || null,
        phone: school.phone?.trim() || null,
        email: school.email?.trim() || null,
      })
      .select("id")
      .single()

    if (schoolError) {
      return { success: false, error: schoolError.message }
    }

    const schoolId = schoolData.id

    // 2. Create default class for the school
    await supabase.from("classes").insert({
      school_id: schoolId,
      grade: 1,
      division: "A",
      academic_year: "2024-25",
    })

    // 3. Create auth user (headmaster)
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: headmaster.email.trim(),
        password: headmaster.password,
        email_confirm: true,
        user_metadata: {
          name: headmaster.name.trim(),
          role: "headmaster",
        },
      })

    if (authError) {
      // Rollback: delete school if auth fails
      await supabase.from("schools").delete().eq("id", schoolId)
      return { success: false, error: authError.message }
    }

    // 4. Create user record in public.users
    const { error: userError } = await supabase.from("users").insert({
      auth_id: authData.user.id,
      school_id: schoolId,
      role: "headmaster",
      name: headmaster.name.trim(),
      email: headmaster.email.trim(),
      phone: headmaster.phone?.trim() || null,
    })

    if (userError) {
      // Auth user was created - we can't easily rollback. Log and return error.
      return { success: false, error: userError.message }
    }

    return { success: true, schoolId }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Registration failed"
    return { success: false, error: msg }
  }
}

export interface AddUserInput {
  role: "teacher" | "clerk" | "student" | "parent"
  name: string
  email: string
  password: string
  phone?: string
  schoolId: string
  classId?: string
  rollNumber?: string
  studentId?: string
  relation?: string
}

export interface AddUserResult {
  success: boolean
  error?: string
  userId?: string
}

export async function addUser(input: AddUserInput): Promise<AddUserResult> {
  try {
    const supabase = createAdminClient()

    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: input.email.trim(),
        password: input.password,
        email_confirm: true,
        user_metadata: {
          name: input.name.trim(),
          role: input.role,
        },
      })

    if (authError) {
      return { success: false, error: authError.message }
    }

    // 2. Create user record
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        auth_id: authData.user.id,
        school_id: input.role === "parent" ? null : input.schoolId,
        role: input.role,
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || null,
      })
      .select("id")
      .single()

    if (userError) {
      return { success: false, error: userError.message }
    }

    const userId = userData.id

    // 3. Create role-specific records
    if (input.role === "student" && input.classId) {
      const { error: studentError } = await supabase.from("students").insert({
        school_id: input.schoolId,
        class_id: input.classId,
        name: input.name.trim(),
        roll_number: input.rollNumber?.trim() || null,
        user_id: userId,
      })
      if (studentError) {
        return { success: false, error: studentError.message }
      }
    }

    if (input.role === "parent" && input.studentId) {
      const { error: parentError } = await supabase.from("parents").insert({
        student_id: input.studentId,
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || null,
        relation: input.relation || "parent",
        user_id: userId,
      })
      if (parentError) {
        return { success: false, error: parentError.message }
      }
    }

    return { success: true, userId }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to add user"
    return { success: false, error: msg }
  }
}
