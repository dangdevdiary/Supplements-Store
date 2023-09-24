/* eslint-disable jsx-a11y/label-has-associated-control */
interface INewPassForm {
  newPassword: string;
  confirmNewPassword: string;
}
interface INewPassFormProps extends INewPassForm {
  updateFields: (fields: Partial<INewPassForm>) => void;
}
function NewPassword({ confirmNewPassword, newPassword, updateFields }: INewPassFormProps) {
  return (
    <div className='mt-3 mb-4 grid grid-cols-1 place-items-center justify-start gap-4'>
      <h2>Please enter your new password</h2>
      <input
        required
        minLength={6}
        value={newPassword}
        onChange={(e) => {
          updateFields({ newPassword: e.target.value });
        }}
        className='block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
        type='text'
        placeholder='New password'
      />
      <input
        required
        minLength={6}
        className='block w-full max-w-xs rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
        type='text'
        value={confirmNewPassword}
        placeholder='Confirm new password'
        onChange={(e) => {
          updateFields({ confirmNewPassword: e.target.value });
        }}
      />
    </div>
  );
}

export default NewPassword;
