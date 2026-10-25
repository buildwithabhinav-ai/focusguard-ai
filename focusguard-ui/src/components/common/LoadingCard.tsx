import Card from "./Card";

const LoadingCard = () => {
  return (
    <Card className="flex h-40 items-center justify-center">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Loading...
      </div>
    </Card>
  );
};

export default LoadingCard;