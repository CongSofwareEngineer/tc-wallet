import { useQuery } from '@tanstack/react-query'

import { TYPE_URL_IMAGE } from '@/constants/app'
import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import { IQueryKey } from '@/types/reactQuery'
import { detectUrlImage } from '@/utils/functions'

const getData = async ({ queryKey }: IQueryKey): Promise<keyof typeof TYPE_URL_IMAGE> => {
  try {
    const url = queryKey[1] as string

    const response = await fetch(detectUrlImage(url), { method: 'HEAD', redirect: 'manual' }) // chỉ lấy header

    const contentDisposition = response.headers.get('content-disposition') || ''

    const isLinkDownLoad = contentDisposition.includes('attachment')
    const contentType = response.headers.get('Content-Type') || ''

    if (response?.status !== 200 || isLinkDownLoad || response.type === 'opaque') {
      return TYPE_URL_IMAGE.Image
    }

    switch (true) {
      case contentType.includes('image'):
      case contentType.includes('zip'):
      case contentType.includes('Zip'):
        return TYPE_URL_IMAGE.Image

      case contentType.includes('video'):
        return TYPE_URL_IMAGE.Video

      case contentType.includes('audio'):
      case contentType.includes('mp3'):
        return TYPE_URL_IMAGE.Audio

      default:
        return TYPE_URL_IMAGE.IFrame
    }
  } catch (error) {
    return TYPE_URL_IMAGE.Image
  }
}

const useTypeUrlImage = (url?: string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [KEY_REACT_QUERY.getTypeUrlImage, url],
    queryFn: getData,
    enabled: !!url,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  console.log({ data })

  return {
    isLoading,
    data: data || null,
    refetch,
  }
}

export default useTypeUrlImage
