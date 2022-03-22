import { FC } from 'react';
import { checkStatusCode } from '../Auth/CodeSupport';

interface Error {
  message: string;
  status: number;
  className?: string | string[];
}

const ServerErrorMessage: FC<Error> = ({ message, status, className }) => {
  const formattedCustomClasses =
    typeof className === 'object'
      ? className.reduce((acc, next) => `${acc} ${next}`, '')
      : className;

  const statusClass = checkStatusCode(status);

  return (
    <p className={`${formattedCustomClasses} ${statusClass}`}>{message}</p>
  );
};

export default ServerErrorMessage;
