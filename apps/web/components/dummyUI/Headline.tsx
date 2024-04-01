export const Headline: React.FC<{ headline: string; questionId: string }> = ({ headline, questionId }) => {
  return (
    <label htmlFor={questionId} className="mb-1.5 block text-base font-semibold leading-6 text-slate-900">
      {headline}
    </label>
  );
};

export default Headline;
