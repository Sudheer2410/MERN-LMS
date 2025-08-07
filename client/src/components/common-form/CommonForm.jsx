import { Button } from "../ui/button";
import FormControls from "./form-controls";
import PropTypes from "prop-types";

function CommonForm({
  handleSubmit,
  buttonText = "Submit",
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* render form controls here */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button 
        disabled={isButtonDisabled} 
        type="submit" 
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {buttonText}
      </Button>
    </form>
  );
}

CommonForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  formControls: PropTypes.array,
  formData: PropTypes.object,
  setFormData: PropTypes.func.isRequired,
  isButtonDisabled: PropTypes.bool,
};

export default CommonForm;
