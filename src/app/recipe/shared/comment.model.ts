import { Model } from '@model';

export class Comment extends Model {
    documentId: string;
    text: string;
    author: string;
    resolved: boolean;
    parent: string;
    
    authorName: string;

    constructor(data: any) {
        super(data);
        this.documentId = data.documentId || '';
        this.text = data.text || '';
        this.author = data.author || '';
        this.resolved = data.resolved || false;
        this.parent = data.parent || '';
    }

    public getObject(): CommentObject {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, authorName, ...comment } = this;
        return comment;
    }
}

export type CommentObject = Omit<Comment, 'id' | 'authorName'>;
