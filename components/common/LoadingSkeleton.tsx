function LoadingSkeleton({ classname }: { classname: string }) {
  return <div className={`${classname} animate-pulse rounded-md bg-slate-200`} />;
}

export default LoadingSkeleton;
