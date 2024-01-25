import { PublicProfile } from "src/api/types";
import moment from 'moment';
import { useEffect, useState } from "react";

export const useIsProfileContacted = (
    selectedProfile: PublicProfile,
    contactMessage?: string,
    contactedMessage?: string,
) => {
    const [ existingContactMessage, setExistingcontactMessage ] = useState<
    typeof contactMessage | typeof contactedMessage | null
  >(null)
  const [ isContacted, setIsContacted ] = useState<boolean>()
  
  useEffect(() => {
    const { lastSentMessage, lastReceivedMessage } = selectedProfile;
    // Check if both timestamps are null
    if (!lastSentMessage && !lastReceivedMessage) {
      setExistingcontactMessage(null);
      setIsContacted(false)
    } 

    // Check if at least one timestamp is defined
    if (lastSentMessage || !lastReceivedMessage) {
      setIsContacted(true)
    } 

    // if we have contact messages to return
    if (contactMessage && contactedMessage) {
      // Check if only lastSentMessage is defined
      if (lastSentMessage && !lastReceivedMessage) {
        setExistingcontactMessage(contactMessage);
      }

      // Check if only lastReceivedMessage is defined
      if (!lastSentMessage && lastReceivedMessage) {
        setExistingcontactMessage(contactedMessage);
      }

      // Compare timestamps when both are defined
      const a = moment(lastSentMessage);
      const b = moment(lastReceivedMessage);

      if (a.isAfter(b)) {
        setExistingcontactMessage(contactedMessage);
      } else {
        setExistingcontactMessage(contactMessage);
      }
    }
  }, [selectedProfile, contactMessage, contactedMessage])

    return {
        isContacted,
        existingContactMessage,
    }
}