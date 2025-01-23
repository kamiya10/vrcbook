import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '../ui/button';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="secondary"
      size="sm"
      className="absolute left-2 top-2"
      onClick={() => void navigate(-1)}
    >
      <ArrowLeft />
      {' '}
      Back
    </Button>
  );
};
BackButton.displayName = 'BackButton';

export default BackButton;
