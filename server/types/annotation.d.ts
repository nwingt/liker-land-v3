import type { Timestamp } from 'firebase-admin/firestore'

export interface AnnotationFirestoreData extends AnnotationBase {
  createdAt: Timestamp
  updatedAt: Timestamp
}
