
export const events = [
  {
      id: 1,
      title: 'Cumpleaños de Alejandra',
      notes: 'Hay que comprar el pastel',
      start: new Date('2022-10-21 13:00:00'),
      end: new Date('2022-10-21 15:00:00'),
      bgColor: '#fafafa',
  },
//   {
//     id: 1,
//     title: "Cumpleaños de Alejandra",
//     notes: "Hay que comprar el pastel",
//     start: format(new Date("2022-10-21 13:00:00"), "yyyy-MM-dd'T'HH:mm:ssxxx"),
//     end: format(new Date("2022-10-21 15:00:00"), "yyyy-MM-dd'T'HH:mm:ssxxx"),
//     bgColor: "#fafafa",
//   },
  {
    id: 2,
    title: "Diana paseo picnic",
    notes: "Comprar aperitivos",
    start: new Date("2022-11-09 13:00:00"),
    end: new Date("2022-11-09 15:00:00"),
    bgColor: "#fafafa",
  },
];

export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null,
};

export const calendarWithEventsState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: null,
};

export const calendarWithActiveEventsState = {
  isLoadingEvents: false,
  events: [],
  activeEvent: { ...events[0] },
};
