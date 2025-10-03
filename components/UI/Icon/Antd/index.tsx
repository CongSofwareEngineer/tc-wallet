import AntDesign from '@expo/vector-icons/AntDesign'
import React from 'react'

type Props = {
  name: keyof typeof AntDesign.glyphMap
} & React.ComponentProps<typeof AntDesign>
const IconAntd = ({ name, size, ...props }: Props) => {
  return <AntDesign name={name} size={size} {...props} />
}
export default IconAntd
