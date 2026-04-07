export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // Necesario para evitar problemas de CORS
    image.src = url
  })

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Retorna el nuevo area de limite de un rectangulo girado.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * Funcion encargada de recortar y devolver la imagen en Blob usando los datos del Canvas
 */
export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  // Calcular el tamaño total sumando rotaciones
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // Mover el contexto al centro
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // Dibujar la imagen base
  ctx.drawImage(image, 0, 0)

  // Convertir a pixeles recortados
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  // Limpiar y fijar tamaño final del lienzo
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Pegar la edicion recortada
  ctx.putImageData(data, 0, 0)

  // Devolver archivo Blob binario
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(file)
    }, 'image/png')
  })
}
