import { useMemo, useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { addHours } from "date-fns";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

import Modal from "react-modal";
import { differenceInSeconds } from "date-fns/esm";

import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks";
import { getEnvVariables } from "../../helpers";

registerLocale("es", es);

const initialState = {
  title: "",
  notes: "",
  start: new Date(),
  end: addHours(new Date(), 2),
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// Modal.setAppElement("#root");

if (getEnvVariables().VITE_MODE !== 'test') {
  Modal.setAppElement('#root');
}

export const CalendarModal = () => {
  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent } = useCalendarStore();
  const { user } = useAuthStore();

  const isMyEvent = user?.uid === activeEvent?.user?._id;
  const isNewEvent = !activeEvent?.id;

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValues, setFormValues] = useState(initialState);

  useEffect(() => {
    if (activeEvent) {
      setFormValues({ ...activeEvent });
    } else {
      setFormValues(initialState);
    }
  }, [activeEvent]);

  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";

    return formValues.title.length > 0
      ? // ? 'is-valid'
        ""
      : "is-invalid";
  }, [formValues.title, formSubmitted]);

  const onInputChange = ({ target }) => {
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const onDateChange = (date, name) => {
    setFormValues({ ...formValues, [name]: date });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    console.log("onSubmit");

    const difference = differenceInSeconds(formValues.end, formValues.start);

    if (isNaN(difference) || difference <= 0)
      return Swal.fire(
        "Fechas incorrectas",
        "Revisar las fechas ingresadas",
        "error"
      );

    if (formValues.title.length <= 0) return;

    await startSavingEvent(formValues);
    closeDateModal();

    setFormSubmitted(true);
  };

  return (
    <Modal
      isOpen={isDateModalOpen}
      onRequestClose={closeDateModal}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label>Fecha y hora inicio</label>
          <DatePicker
            // name={"start"}
            selected={formValues.start}
            onChange={(e) => onDateChange(e, "start")}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <div className="form-group mb-2">
          <label>Fecha y hora fin</label>
          <DatePicker
            // name={"end"}
            minDate={formValues.start}
            selected={formValues.end}
            onChange={(e) => onDateChange(e, "end")}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={onInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={formValues.notes}
            onChange={onInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        {(isMyEvent || isNewEvent) && (
          <button type="submit" className="btn btn-outline-primary btn-block">
            <i className="far fa-save"></i>
            <span> Guardar</span>
          </button>
        )}
      </form>
    </Modal>
  );
};
