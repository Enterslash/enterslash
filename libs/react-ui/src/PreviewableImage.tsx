import { Image, ImageProps } from 'antd';

type Props = ImageProps;

export default function PreviewableImage({ ...rest }: Props) {
  return <Image {...rest} />;
}
