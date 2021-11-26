import '../styles/globals.css'
import {GeistProvider, CssBaseline, Button} from '@geist-ui/react'
import {useState} from 'react'
import styles from '../styles/Home.module.css'
import { Moon, Sun } from '@geist-ui/react-icons'

function MyApp({ Component, pageProps }) {
  const [themeType, setThemeType] = useState(false);
  return(
    <GeistProvider themeType={themeType ? 'dark' : 'light'}>
      <Button iconRight={themeType ? <Moon /> : <Sun />} auto scale={2/3} px={0.6} onClick={() => setThemeType(!themeType)} className={styles.fixed} />
      <CssBaseline>
      <Component {...pageProps} />
      </CssBaseline>
    </GeistProvider>
  )
}

export default MyApp
