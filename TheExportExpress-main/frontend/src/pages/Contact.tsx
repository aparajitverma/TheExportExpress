import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  company: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  country: Yup.string()
    .required('Required'),
  message: Yup.string()
    .min(10, 'Too Short!')
    .max(1000, 'Too Long!')
    .required('Required'),
});

export default function Contact() {
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // TODO: Implement API call to send message
      console.log(values);
      alert('Thank you for your message. We will get back to you soon!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('There was an error sending your message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Get in Touch</h2>
            <div className="mt-3">
              <p className="text-lg text-gray-500">
                Interested in our products? Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            <div className="mt-9">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>info@theexportexpress.com</p>
                </div>
              </div>
              <div className="mt-6 flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>+91 (123) 456-7890</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 md:mt-0">
            <Formik
              initialValues={{
                name: '',
                email: '',
                company: '',
                country: '',
                message: '',
              }}
              validationSchema={ContactSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="grid grid-cols-1 gap-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="input-field"
                      />
                      {errors.name && touched.name && (
                        <div className="mt-1 text-sm text-red-600">{errors.name}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="input-field"
                      />
                      {errors.email && touched.email && (
                        <div className="mt-1 text-sm text-red-600">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <div className="mt-1">
                      <Field
                        type="text"
                        name="company"
                        id="company"
                        className="input-field"
                      />
                      {errors.company && touched.company && (
                        <div className="mt-1 text-sm text-red-600">{errors.company}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="mt-1">
                      <Field
                        type="text"
                        name="country"
                        id="country"
                        className="input-field"
                      />
                      {errors.country && touched.country && (
                        <div className="mt-1 text-sm text-red-600">{errors.country}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <div className="mt-1">
                      <Field
                        as="textarea"
                        name="message"
                        id="message"
                        rows={4}
                        className="input-field"
                      />
                      {errors.message && touched.message && (
                        <div className="mt-1 text-sm text-red-600">{errors.message}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
} 