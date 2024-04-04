export class BaseModel {
  id: number | null = null;
  createdAt: string | null = null;
  updatedAt: string | null = null;
  deletedAt: string | null = null;

  isSaving?: boolean;
  isDeleting?: boolean;

  constructor(data?: any) {
    this.fromJson(data);
  }

  fromJson(values: object = {}) {
    Object.assign(this, values);
  }
}
