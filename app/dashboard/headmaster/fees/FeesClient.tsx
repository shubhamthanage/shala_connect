"use client"

import { FeeTable } from "@/components/fees/FeeTable"
import type { FeeOverviewData } from "@/app/actions/fees"

export function FeesClient({ data }: { data: FeeOverviewData }) {
  return (
    <FeeTable
      classWiseStatus={data.classWiseStatus}
      defaulters={data.defaulters}
    />
  )
}
