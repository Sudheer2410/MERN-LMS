import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import PropTypes from "prop-types";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

function FormControls({ formControls = [], formData, setFormData }) {
  const [showPassword, setShowPassword] = useState(false);

  function getIcon(type, name) {
    if (name.toLowerCase().includes("email")) return <Mail className="h-5 w-5 text-gray-400" />;
    if (name.toLowerCase().includes("user")) return <User className="h-5 w-5 text-gray-400" />;
    if (type === "password") return <Lock className="h-5 w-5 text-gray-400" />;
    return null;
  }

  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";
    const icon = getIcon(getControlItem.type, getControlItem.name);

    switch (getControlItem.componentType) {
      case "input":
        if (getControlItem.type === "password") {
          element = (
            <div className="relative">
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={showPassword ? "text" : "password"}
                value={currentControlItemValue}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
                className="h-12 px-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                autoComplete={getControlItem.name}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          );
        } else {
          element = (
            <div className="relative">
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={getControlItem.type}
                value={currentControlItemValue}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
                className="h-12 px-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                autoComplete={getControlItem.name}
              />
              {icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {icon}
                </span>
              )}
            </div>
          );
        }
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={currentControlItemValue}
          >
            <SelectTrigger className="w-full h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="min-h-[80px] px-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          />
        );
        break;

      default:
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="h-12 px-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            autoComplete={getControlItem.name}
          />
        );
        break;
    }

    return element;
  }

  return (
    <div className="space-y-5">
      {formControls.map((controleItem) => (
        <div key={controleItem.name} className="space-y-2">
          <Label 
            htmlFor={controleItem.name}
            className="text-sm font-medium text-gray-700"
          >
            {controleItem.label}
          </Label>
          {renderComponentByType(controleItem)}
        </div>
      ))}
    </div>
  );
}

FormControls.propTypes = {
  formControls: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      componentType: PropTypes.oneOf(["input", "select", "textarea"]).isRequired,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ),
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default FormControls;
