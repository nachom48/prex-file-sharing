export default class CommonDTO {
    id: string;
    createdBy: string;
    createdDate: Date;
    lastModifiedDate: Date | null;
    lastModifiedBy: string;
    deleteDate: Date | null;
}