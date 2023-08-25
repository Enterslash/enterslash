interface Props {
  children: React.ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-primary p-2">
      <div className="bg-white flex-col p-8 flex shadow-lg rounded-lg sm:w-[500px] w-full">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
