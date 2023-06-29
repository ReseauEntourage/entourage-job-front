import moment from 'moment/moment';
import {
  EVENT_TYPE_MAPPING,
  EVENT_TYPES,
  EVENT_TYPES_FILTERS,
  OFFER_STATUS,
} from 'src/constants';

export function mapEventObject(events, eventType) {
  if (eventType) {
    const filteredEvents = events.filter(({ type }) => {
      return type === eventType;
    });

    return {
      date:
        filteredEvents.length > 0
          ? moment(
              filteredEvents.sort(
                ({ createdAt: createdAtA }, { createdAt: createdAtB }) => {
                  return moment(createdAtB)
                    .utc()
                    .diff(moment(createdAtA).utc());
                }
              )[0].startDate
            ).format('DD/MM/YYYY')
          : null,
      ...EVENT_TYPES_FILTERS.find(({ value }) => {
        return value === eventType;
      }),
    };
  }
  return null;
}

export function mapEventDateFromStatus(offerStatus, events) {
  if (offerStatus === OFFER_STATUS[1].value) {
    const followup = mapEventObject(events, EVENT_TYPES.FOLLOWUP);

    if (followup.date) {
      return followup;
    }
  }
  return mapEventObject(events, EVENT_TYPE_MAPPING[offerStatus]);
}
