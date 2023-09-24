interface IOtpForm {
  otp: string[];
}
interface IOtpFormProps extends IOtpForm {
  updateFields: (fields: Partial<IOtpForm>) => void;
}
function OtpForm({ otp, updateFields }: IOtpFormProps) {
  return (
    <div className='mt-4'>
      <h2 className='mb-2 text-center text-lg font-semibold uppercase'>Otp code</h2>
      <div className='mx-auto flex w-full flex-row items-center justify-between'>
        {otp.map((o, i) => (
          <div key={o + i} className='h-16 w-16 '>
            <input
              className='flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1'
              type='text'
              name=''
              id=''
              value={otp[i]}
              onChange={(e) => {
                const newOtp = [...otp];
                newOtp[i] = e.target.value;
                updateFields({ otp: newOtp });
              }}
              maxLength={1}
              required
            />
          </div>
        ))}
      </div>
      <p className='mt-2 text-center text-base'>Otp has seen to your email please check!</p>
    </div>
  );
}

export default OtpForm;
