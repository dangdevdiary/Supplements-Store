/* eslint-disable jsx-a11y/label-has-associated-control */
interface IEmailForm {
  email: string;
}
interface IEmailFormProps extends IEmailForm {
  updateFields: (fields: Partial<IEmailForm>) => void;
}
function EmailForm({ email, updateFields }: IEmailFormProps) {
  return (
    <div className='mt-3 mb-4 grid grid-cols-1 place-items-center justify-start gap-1'>
      <h2>Please enter your email</h2>
      <input
        required
        value={email}
        onChange={(e) => {
          updateFields({ email: e.target.value });
        }}
        className='block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
        type='email'
      />
    </div>
  );
}

export default EmailForm;
