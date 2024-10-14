import { Container } from '@/shared/UIKit/Container/Container';
import { Skeleton } from '@/shared/UIKit/Skeleton/Skeleton';

export default function Loading() {
  return (
    <Container>
      <div className="grid md:grid-cols-2 gap-8 h-svh items-center">
        <div className="grid gap-4">
          <Skeleton className="h-[10rem]" />
          <Skeleton className="h-[5rem]" />
          <Skeleton className="h-[5rem]" />
          <Skeleton className="h-[5rem]" />
          <Skeleton className="h-[5rem]" />
          <Skeleton className="h-[10rem]" />
        </div>
        <div>
          <Skeleton className="h-[40rem]" />
        </div>
      </div>
    </Container>
  );
}
