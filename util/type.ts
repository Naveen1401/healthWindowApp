export type HeathDataType = 'bloodPressure' | 'glucose' | 'insulin' | 'weight';

export interface ReportType {
  id: number;
  patientId: number;
  reportName: string;
  fileExtension: string;
  reportDate: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}