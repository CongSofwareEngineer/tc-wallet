import React from 'react'

// Web-only CSS module for spinner

// @ts-ignore - CSS modules are for web builds only
import { images } from '@/configs/images'
import MyImage from '../MyImage'
import './myLoading.module.web.css'

type Props = {
  size?: number
  color?: string
  variant?: 'sm' | 'md' | 'lg'
}

const MyLoading = ({ size = 50, color, variant = 'md' }: Props) => {
  return <MyImage src={images.gifs.loading} style={{ width: size, height: size }} />
}

export default MyLoading
