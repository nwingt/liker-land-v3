import { FieldValue, Timestamp } from 'firebase-admin/firestore'

import type { AnnotationFirestoreData } from '~/server/types/annotation'

function getAnnotationsCollection(userWallet: string, nftClassId: string) {
  return getUserCollection()
    .doc(userWallet)
    .collection('books')
    .doc(nftClassId.toLowerCase())
    .collection('annotations')
}

function convertFirestoreToAnnotation(data: AnnotationFirestoreData): Annotation {
  const { createdAt, updatedAt, ...baseData } = data
  return {
    ...baseData,
    createdAt: createdAt instanceof Timestamp ? createdAt.toMillis() : 0,
    updatedAt: updatedAt instanceof Timestamp ? updatedAt.toMillis() : 0,
  }
}

export async function getAnnotations(
  userWallet: string,
  nftClassId: string,
): Promise<Annotation[]> {
  const snapshot = await getAnnotationsCollection(userWallet, nftClassId)
    .orderBy('createdAt', 'asc')
    .get()

  return snapshot.docs.map((doc) => {
    const data = doc.data() as AnnotationFirestoreData
    return convertFirestoreToAnnotation(data)
  })
}

export async function getAnnotation(
  userWallet: string,
  nftClassId: string,
  annotationId: string,
): Promise<Annotation | undefined> {
  const doc = await getAnnotationsCollection(userWallet, nftClassId)
    .doc(annotationId)
    .get()

  if (!doc.exists) return undefined

  const data = doc.data() as AnnotationFirestoreData
  return convertFirestoreToAnnotation(data)
}

export async function createAnnotation(
  userWallet: string,
  nftClassId: string,
  annotationId: string,
  data: AnnotationCreateData,
): Promise<Annotation> {
  const now = FieldValue.serverTimestamp()
  const annotationData = {
    id: annotationId,
    cfi: data.cfi,
    text: data.text,
    color: data.color,
    note: data.note || null,
    chapterTitle: data.chapterTitle || null,
    createdAt: now,
    updatedAt: now,
  }

  await getAnnotationsCollection(userWallet, nftClassId)
    .doc(annotationId)
    .set(annotationData)

  const createdDoc = await getAnnotationsCollection(userWallet, nftClassId)
    .doc(annotationId)
    .get()

  return convertFirestoreToAnnotation(createdDoc.data() as AnnotationFirestoreData)
}

export async function updateAnnotation(
  userWallet: string,
  nftClassId: string,
  annotationId: string,
  data: AnnotationUpdateData,
): Promise<Annotation | undefined> {
  const docRef = getAnnotationsCollection(userWallet, nftClassId).doc(annotationId)
  const doc = await docRef.get()

  if (!doc.exists) return undefined

  const updateData: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  }

  if (data.color !== undefined) {
    updateData.color = data.color
  }
  if (data.note !== undefined) {
    updateData.note = data.note || null
  }

  await docRef.update(updateData)

  const updatedDoc = await docRef.get()
  return convertFirestoreToAnnotation(updatedDoc.data() as AnnotationFirestoreData)
}

export async function deleteAnnotation(
  userWallet: string,
  nftClassId: string,
  annotationId: string,
): Promise<boolean> {
  const docRef = getAnnotationsCollection(userWallet, nftClassId).doc(annotationId)
  const doc = await docRef.get()

  if (!doc.exists) return false

  await docRef.delete()
  return true
}
