import Skeleton from 'react-loading-skeleton';

import { Container } from '@/shared/UIKit/Container/Container';

export default function Loading() {
  return (
    <Container>
      <div className="grid md:grid-cols-2 gap-8 h-svh items-center">
        <div className="grid gap-4">
          <Skeleton height={100} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={100} />
        </div>
        <div>
          <Skeleton height={400} />
        </div>
      </div>
    </Container>
  );
}
