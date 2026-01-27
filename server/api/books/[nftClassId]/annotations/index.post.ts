import { ANNOTATION_COLORS } from '~/constants/annotations'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const walletAddress = session.user.evmWallet || session.user.likeWallet
  if (!walletAddress) {
    throw createError({
      statusCode: 401,
      message: 'WALLET_NOT_FOUND',
    })
  }

  const nftClassId = getRouterParam(event, 'nftClassId')
  if (!nftClassId) {
    throw createError({
      statusCode: 400,
      message: 'MISSING_NFT_CLASS_ID',
    })
  }

  let body: { id: string } & AnnotationCreateData
  try {
    body = await readBody(event)
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      message: 'INVALID_BODY',
    })
  }

  if (!body) {
    throw createError({
      statusCode: 400,
      message: 'MISSING_BODY',
    })
  }

  if (!body.id || typeof body.id !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'MISSING_OR_INVALID_ID',
    })
  }

  if (!body.cfi || typeof body.cfi !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'MISSING_OR_INVALID_CFI',
    })
  }

  if (!body.text || typeof body.text !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'MISSING_OR_INVALID_TEXT',
    })
  }

  if (!body.color || !ANNOTATION_COLORS.includes(body.color)) {
    throw createError({
      statusCode: 400,
      message: 'MISSING_OR_INVALID_COLOR',
    })
  }

  try {
    const annotation = await createAnnotation(walletAddress, nftClassId, body.id, {
      cfi: body.cfi,
      text: body.text,
      color: body.color,
      note: body.note,
      chapterTitle: body.chapterTitle,
    })
    return { annotation }
  }
  catch (error) {
    console.error(`Failed to create annotation for ${nftClassId}:`, error)
    throw createError({
      statusCode: 500,
      message: 'FAILED_TO_CREATE_ANNOTATION',
    })
  }
})
