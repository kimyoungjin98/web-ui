type Props = {
  errors: any[];
};

export function TanstackFormError({ errors }: Props) {
  const error = errors[0];

  if (!error) return null;

  return <p className="text-red-600 text-xs">{error}</p>;
}
