import {Event} from './getEvents'

let id = 1;

const getEvent = (date: string) => {
  const event = {
    id: id,
    title: `#${id}`,
    date
  }

  id++;

  return event;
}

export const EVENTS: Event[] = [
  // Май
  getEvent('2024-05-01T00:00:00.000Z'),
  getEvent('2024-05-01T00:00:00.000Z'),
  getEvent('2024-05-01T00:00:00.000Z'),
  getEvent('2024-05-01T00:00:00.000Z'),

  getEvent('2024-05-03T00:00:00.000Z'),

  getEvent('2024-05-08T00:00:00.000Z'),

  getEvent('2024-05-11T00:00:00.000Z'),

  getEvent('2024-05-14T00:00:00.000Z'),

  getEvent('2024-05-17T00:00:00.000Z'),

  getEvent('2024-05-31T00:00:00.000Z'),
  getEvent('2024-05-31T00:00:00.000Z'),
  getEvent('2024-05-31T00:00:00.000Z'),

  // Июнь

  getEvent('2024-06-01T00:00:00.000Z'),
  getEvent('2024-06-01T00:00:00.000Z'),

  getEvent('2024-06-02T00:00:00.000Z'),

  getEvent('2024-06-03T00:00:00.000Z'),
  getEvent('2024-06-03T00:00:00.000Z'),
  getEvent('2024-06-03T00:00:00.000Z'),
  getEvent('2024-06-03T00:00:00.000Z'),

  getEvent('2024-06-04T00:00:00.000Z'),

  getEvent('2024-06-06T00:00:00.000Z'),

  getEvent('2024-06-08T00:00:00.000Z'),
  getEvent('2024-06-08T00:00:00.000Z'),

  getEvent('2024-06-09T00:00:00.000Z'),

  getEvent('2024-06-11T00:00:00.000Z'),

  getEvent('2024-06-11T00:00:00.000Z'),

  getEvent('2024-06-15T00:00:00.000Z'),

  getEvent('2024-06-20T00:00:00.000Z'),
  getEvent('2024-06-20T00:00:00.000Z'),

  getEvent('2024-06-23T00:00:00.000Z'),

  getEvent('2024-06-24T00:00:00.000Z'),
  getEvent('2024-06-24T00:00:00.000Z'),

  getEvent('2024-06-27T00:00:00.000Z'),

  getEvent('2024-06-30T00:00:00.000Z'),

  // Июль 

  getEvent('2024-07-01T00:00:00.000Z'),
  getEvent('2024-07-01T00:00:00.000Z'),
  getEvent('2024-07-01T00:00:00.000Z'),

  getEvent('2024-07-03T00:00:00.000Z'),

  getEvent('2024-07-05T00:00:00.000Z'),

  getEvent('2024-07-08T00:00:00.000Z'),

  getEvent('2024-07-12T00:00:00.000Z'),

  getEvent('2024-07-15T00:00:00.000Z'),

  getEvent('2024-07-16T00:00:00.000Z'),

  getEvent('2024-07-18T00:00:00.000Z'),

  getEvent('2024-07-21T00:00:00.000Z'),

  getEvent('2024-07-28T00:00:00.000Z'),

  getEvent('2024-07-30T00:00:00.000Z'),

  getEvent('2024-07-31T00:00:00.000Z'),
  getEvent('2024-07-31T00:00:00.000Z'),
  getEvent('2024-07-31T00:00:00.000Z'),
  getEvent('2024-07-31T00:00:00.000Z'),
  getEvent('2024-07-31T00:00:00.000Z'),
  getEvent('2024-07-31T00:00:00.000Z'),
  getEvent('2024-07-31T00:00:00.000Z'),
  getEvent('2024-07-31T00:00:00.000Z'),
]