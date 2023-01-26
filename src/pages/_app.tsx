import "../styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { store } from "../store/store"
import Layout from "../components/Layout"
import { ToastContainer } from "react-toastify"

export default function App({ Component, pageProps }: AppProps) {
   return (
      <Provider store={store}>
         <Layout>
            <Component {...pageProps} />
         </Layout>
         <ToastContainer/>
      </Provider>
   )
}
