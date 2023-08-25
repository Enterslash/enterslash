import { useRouter } from 'next/router';
import { checkAccess } from '../utils/checkAccess';
import { UserType } from '@enterslash/enterus/types';

type Props = {
  children: JSX.Element;
  access: UserType | UserType[];
};

export default function Private({ children, access }: Props) {
  const router = useRouter();
  if (checkAccess(access)) {
    return children;
  } else {
    router.push('/');
    return null;
  }
}
