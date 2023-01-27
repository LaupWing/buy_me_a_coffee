import { GetServerSideProps } from "next"

const Campaign = () => {
   return (
      <div className="container mt-6">Campaign</div>
   )
}
export default Campaign


export const getServerSideProps:GetServerSideProps = async () => {
   console.log("from the server")

   return {
      props: {

      }
   }
}