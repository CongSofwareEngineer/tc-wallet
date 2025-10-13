import { useQuery } from '@tanstack/react-query'

import fetcher from '@/configs/fetcher'
import { IQueryKey } from '@/types/reactQuery'
import { lowercase } from '@/utils/functions'

const getData = async ({ queryKey }: IQueryKey) => {
  try {
    const dataHex = queryKey[1] as string
    if (dataHex === '0x') {
      return 'transfer'
    }
    const hexFunc = lowercase(`0x${dataHex.slice(2, 10)}`)
    const res1 = await fetcher({
      url: `https://api.openchain.xyz/signature-database/v1/lookup?function=${hexFunc}`,
    })
    if (res1?.data?.result?.function?.[hexFunc!]) {
      return res1?.data.result.function[hexFunc!][0]?.name
    }
    return res1
  } catch (error) { }
}

const useFunctionNameDecode = (dataHex: string = '') => {
  const data = useQuery({
    queryKey: ['functionNameDecode', dataHex],
    queryFn: getData,
    enabled: !!dataHex,
  })

  return data
}

export default useFunctionNameDecode
