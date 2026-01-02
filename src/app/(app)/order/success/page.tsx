import { Suspense } from "react";
import { SuccessContent } from "@/components/order-success/success-content";
import { Receipt } from "@/components/order-success/receipt";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : "";

  return (
    <SuccessContent sessionId={sessionId}>
      <Suspense
        fallback={
          <div className="w-full max-w-md space-y-6">
            <div className="flex flex-col gap-1 items-center">
              <Skeleton className="h-6 w-48 rounded-full bg-muted" />
            </div>

            <div className="w-full border border-border rounded-xl p-6 bg-card">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="pt-4 border-t border-border flex justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <Receipt sessionId={sessionId} />
      </Suspense>
    </SuccessContent>
  );
}
