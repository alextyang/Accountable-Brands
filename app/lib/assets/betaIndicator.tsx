export default function BetaIndicator({ className }: { className?: string }) {
  return (
    <div className={"bg-black text-tan px-1.5 pt-px font-semibold text-base h-7 " + className}>
      <p className="relative top-px">BETA</p>
    </div>
  );
}
