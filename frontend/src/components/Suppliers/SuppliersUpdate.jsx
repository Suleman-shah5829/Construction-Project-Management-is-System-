import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSuppliersById,
  updateSupplier,
} from "../../services/suppliersServices";
import { Spinner } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";

const SuppliersUpdate = () => {
  let [suppliers, setSuppliers] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  //event handlers
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    getSuppliersById(id)
      .then((res) => {
        setSuppliers((currentdata) => {
          return {
            ...currentdata,
            name: res.data[0].name,
            phone: res.data[0].phone,
            email: res.data[0].email,
            address: res.data[0].address,
          };
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) error = "Supplier name is required";
      else if (/\d/.test(value))
        error = "Supplier name must not contain numbers";
    }
    if (name === "phone" && !value) {
      error = "Phone number is required:";
    }
    if (
      name === "email" &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ) {
      error = "Invalid email format";
    }
    if (name === "address" && !value) {
      error = "Supplier address is required";
    }
    return error;
  };
  const validateForm = () => {
    const newError = {};
    Object.keys(suppliers).forEach((field) => {
      const error = validateField(field, suppliers[field]);
      if (error) {
        newError[field] = error;
      }
    });
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    const error = validateField(name, value);
    console.log(name, value, error);

    setSuppliers({ ...suppliers, [name]: value });
    setErrors({ ...errors, [name]: error });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("validateForm", validateForm());
    if (validateForm()) {
      updateSupplier(id, suppliers)
        .then(() => {
          setSuccess(true);
          setTimeout(() => {
            navigate("/suppliers", {
              state: { success: true, type: "update" },
            });
          }, 1000);
        })
        .catch((err) => console.log(err));
    }
  };

  //UI

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">Edit Supplier</h3>
        <form onSubmit={handleSubmit}>
          <h6 style={{ color: "#ff8528" }}>
            the filed followed by asterisk ( <span> * </span>) are necessary to
            filed.
          </h6>
          <div className="mb-3">
            <label className="form-label">
              Name <span> * </span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleInputChange}
              value={suppliers.name}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="enter supplier name "
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">
              Phone <span> * </span>
            </label>

            <input
              type="number"
              id="phone"
              name="phone"
              onChange={handleInputChange}
              value={suppliers.phone}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              placeholder="enter supplier conatct number "
            />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">
              Email <span> * </span>
            </label>

            <input
              type="email"
              id="email"
              name="email"
              onChange={handleInputChange}
              value={suppliers.email}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="enter supplier email "
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">
              Address <span> * </span>
            </label>

            <textarea
              name="address"
              id="address"
              onChange={handleInputChange}
              value={suppliers.address}
              rows={5}
              cols={5}
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              placeholder="enter supplier address "
            ></textarea>
            {errors.address && (
              <div className="text-danger">{errors.address}</div>
            )}
          </div>

          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={success}
            >
              {success ? (
                <>
                  <Spinner animation="border" size="sm" /> Adding...
                </>
              ) : (
                <>
                  <SaveIcon /> Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuppliersUpdate;
