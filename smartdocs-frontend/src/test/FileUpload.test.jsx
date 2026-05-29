import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import FileUpload from '../components/FileUpload'

// Mock documentService
vi.mock('../services/documentService', () => ({
  uploadDocuments: vi.fn(),
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}))

describe('FileUpload', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders drop zone and disabled upload button', () => {
    render(<FileUpload />)
    expect(screen.getByText(/drag & drop pdf files here/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload files/i })).toBeDisabled()
  })

  it('enables upload button after a file is added', async () => {
    render(<FileUpload />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

    await userEvent.upload(input, file)

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /upload files/i })).not.toBeDisabled()
    )
  })

  it('shows file name after drop', async () => {
    render(<FileUpload />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['data'], 'my-doc.pdf', { type: 'application/pdf' })

    await userEvent.upload(input, file)

    await waitFor(() => expect(screen.getByText('my-doc.pdf')).toBeInTheDocument())
  })

  it('shows Pending status badge for added file', async () => {
    render(<FileUpload />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['data'], 'pending.pdf', { type: 'application/pdf' })

    await userEvent.upload(input, file)

    await waitFor(() => expect(screen.getByText('Pending')).toBeInTheDocument())
  })

  it('shows error toast for non-PDF file', async () => {
    const toast = await import('react-hot-toast')
    render(<FileUpload />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['data'], 'image.png', { type: 'image/png' })

    await userEvent.upload(input, file)

    await waitFor(() => expect(toast.default.error).toHaveBeenCalledWith(expect.stringContaining('not a PDF')))
  })

  it('uploads files and shows Completed on success', async () => {
    const { uploadDocuments } = await import('../services/documentService')
    uploadDocuments.mockResolvedValueOnce({ data: [] })

    render(<FileUpload />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['data'], 'upload.pdf', { type: 'application/pdf' })
    await userEvent.upload(input, file)

    const btn = await screen.findByRole('button', { name: /upload files/i })
    fireEvent.click(btn)

    await waitFor(() => expect(screen.getByText('Completed')).toBeInTheDocument())
  })

  it('shows Failed status on upload error', async () => {
    const { uploadDocuments } = await import('../services/documentService')
    uploadDocuments.mockRejectedValueOnce(new Error('Network error'))

    render(<FileUpload />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['data'], 'fail.pdf', { type: 'application/pdf' })
    await userEvent.upload(input, file)

    const btn = await screen.findByRole('button', { name: /upload files/i })
    fireEvent.click(btn)

    await waitFor(() => expect(screen.getByText('Failed')).toBeInTheDocument())
  })
})
