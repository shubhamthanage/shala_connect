-- Add recipient_phone and meta columns to notifications for WhatsApp log
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS recipient_phone text,
  ADD COLUMN IF NOT EXISTS meta jsonb DEFAULT '{}';

-- Add index for phone lookups
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_phone
  ON notifications(recipient_phone);
