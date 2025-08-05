export enum InquiryStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESPONDED = 'responded',
  ARCHIVED = 'archived',
}

export interface IInquiry {
  _id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  message: string;
  productId?: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}

export interface IInquiryCreate extends Omit<IInquiry, '_id' | 'status' | 'createdAt' | 'updatedAt' | 'respondedAt'> {} 