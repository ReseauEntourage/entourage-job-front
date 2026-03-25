import { Card } from '@/src/components/ui';

export const CardDataInclusion = () => {
  return (
    <Card title="Rechercher les structures de l'inclusion autour de vous">
      <iframe
        src={`https://api.data.inclusion.gouv.fr/widget?token=${process.env.NEXT_PUBLIC_DATA_INCLUSION_TOKEN}&score_qualite_minimum=0.9&x=3&y=2&include_remote_services=true`}
        width="100%"
        height="900"
        style={{ border: 'none' }}
      />
    </Card>
  );
};
