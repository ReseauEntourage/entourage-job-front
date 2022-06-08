import React from 'react';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { openModal } from 'src/components/modals/Modal';
import ModalGeneric from 'src/components/modals/ModalGeneric';

export const openContactModal = (formLink) => {
  console.log(formLink);
  gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
  fbEvent(FB_TAGS.COMPANY_CONTACT);
  openModal(
    <ModalGeneric>
      <iframe
        className="airtable-embed"
        src={`${
          formLink || process.env.AIRTABLE_LINK_COMPANY_HELP
        }?backgroundColor=orange`}
        frameBorder="0"
        title="modal-company-help"
        width="100%"
        height="533"
        style={{
          background: 'transparent',
          border: '1px solid #ccc;',
        }}
      />
    </ModalGeneric>
  );
};
