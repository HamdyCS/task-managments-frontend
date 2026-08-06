import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Container } from '../../components/layout/Container'
import { staggerContainer, staggerItem } from '../../animations'

const companies = [
  { name: 'TechSphere', icon: '🌐' },
  { name: 'Nova Labs', icon: '🔬' },
  { name: 'BrightCore', icon: '💡' },
  { name: 'PixelForge', icon: '📈' },
  { name: 'QuantumX', icon: '🧠' },
]

export function SocialProofSection() {
  const { t } = useTranslation()

  return (
    <section className="py-24 border-t border-border/20">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-center"
        >
          <motion.p
            variants={staggerItem}
            className="text-xs font-medium text-muted-foreground mb-12 uppercase tracking-widest"
          >
            {t('socialProof.title')}
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
          >
            {companies.map((company) => (
              <div
                key={company.name}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <span className="text-2xl">{company.icon}</span>
                <span className="font-bold text-lg">{company.name}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
