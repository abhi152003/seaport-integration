import Image from 'next/image'
import styles from './page.module.css'
import SeaportIntegration from './seaport'

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <SeaportIntegration />
      </div>
    </main>
  )
}
