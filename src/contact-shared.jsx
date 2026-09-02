import React, { useState } from 'react'
import { ArrowRight, CheckCircle } from '@phosphor-icons/react'

const subjects = ['Matériel', 'Formation', 'Maintenance / SAV', 'Partenariat', 'Autre demande']

export function ContactForm({ defaultSubject = '', context = '', id, compact = false }) {
  const initialSubject = subjects.includes(defaultSubject) ? defaultSubject : ''
  const [status, setStatus] = useState('idle')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity()
      return
    }
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="expert-contact-success" role="status" id={id}>
        <CheckCircle weight="fill" />
        <h2>Votre demande a bien été enregistrée.</h2>
        <p>Notre équipe vous recontactera rapidement pour préciser votre besoin.</p>
        <button type="button" onClick={() => setStatus('idle')}>Envoyer une autre demande</button>
      </div>
    )
  }

  return (
    <form className={`expert-contact-form ${compact ? 'is-compact' : ''}`} id={id} onSubmit={handleSubmit}>
      {context && <input name="contexte" type="hidden" value={context} readOnly />}
      <div className="expert-contact-grid">
        <label><span>Nom *</span><input name="nom" type="text" required autoComplete="family-name" /></label>
        <label><span>Prénom *</span><input name="prenom" type="text" required autoComplete="given-name" /></label>
        <label><span>E-mail professionnel *</span><input name="email" type="email" required autoComplete="email" /></label>
        <label><span>Téléphone</span><input name="telephone" type="tel" autoComplete="tel" /></label>
        <label className="is-wide"><span>Sujet *</span>
          <select name="sujet" required defaultValue={initialSubject}>
            <option value="" disabled>Sélectionnez un sujet</option>
            {subjects.map((subject) => <option value={subject} key={subject}>{subject}</option>)}
          </select>
        </label>
        <label className="is-wide"><span>Message *</span><textarea name="message" rows={compact ? 4 : 6} required defaultValue={context ? `Bonjour, je souhaite obtenir des informations concernant ${context}.` : ''} /></label>
      </div>
      <button className="expert-contact-submit" type="submit">Envoyer la demande <ArrowRight weight="bold" /></button>
    </form>
  )
}
