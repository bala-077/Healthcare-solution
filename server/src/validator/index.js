const { z } = require('zod');

const onboardingSchema = z.object({
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  name: z.string().min(1, 'Name is required').trim(),
  occupation: z.string().min(1, 'Occupation is required').trim(),
  profileImage: z.string().optional(),
});

const connectRequestSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
});

const acceptConnectSchema = z.object({
  senderId: z.string().min(1, 'Sender ID is required'),
});

const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

const sendMessageSchema = z.object({
  receiverId: z.union([
    z.string().min(1, 'Receiver ID is required'),
    z.array(z.string()).min(1, 'At least one Receiver ID is required')
  ]),
  message: z.string().optional(),
  sharedPostId: z.string().optional(),
}).refine(data => data.message || data.sharedPostId, {
  message: "Either message or sharedPostId must be provided",
  path: ["message"],
});

module.exports = {
  onboardingSchema,
  connectRequestSchema,
  acceptConnectSchema,
  createPostSchema,
  sendMessageSchema,
};
