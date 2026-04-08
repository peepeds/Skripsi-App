export function TwoColumnLayout({ left, right, leftClassName = "", rightClassName = "", className = "" }) {
  return (
    <div className={`grid grid-cols-12 gap-8 ${className}`}>
      <div className={`col-span-8 max-lg:col-span-12 space-y-6 ${leftClassName}`}>
        {left}
      </div>
      <div className={`col-span-4 max-lg:col-span-12 space-y-6 ${rightClassName}`}>
        {right}
      </div>
    </div>
  );
}
