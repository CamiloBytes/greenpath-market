import { describe, expect, it, afterEach, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewFormModal } from "./ReviewFormModal";
import type { CreateReviewPayload } from "@/src/types/ReviewTypes";

afterEach(cleanup);

const renderModal = (overrides: {
  onSubmit?: (payload: CreateReviewPayload) => Promise<boolean>;
  submitting?: boolean;
  onClose?: () => void;
} = {}) => {
  return render(
    <ReviewFormModal
      isOpen
      shopName="Verduras Doña Ana"
      submitting={overrides.submitting ?? false}
      onSubmit={overrides.onSubmit ?? vi.fn().mockResolvedValue(true)}
      onClose={overrides.onClose ?? vi.fn()}
    />
  );
};

describe("ReviewFormModal", () => {
  it("publica la reseña con calificación y comentario", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    renderModal({ onSubmit });

    await user.click(screen.getByRole("radio", { name: "5 estrellas" }));
    await user.type(
      screen.getByPlaceholderText("Cuéntanos tu experiencia con esta tienda"),
      "Increíble atención"
    );
    await user.click(screen.getByRole("button", { name: "Publicar reseña" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        rating: 5,
        comment: "Increíble atención",
      });
    });
  });

  it("no publica si no se selecciona calificación", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    renderModal({ onSubmit });

    await user.click(screen.getByRole("button", { name: "Publicar reseña" }));

    expect(
      await screen.findByText("Debes seleccionar entre 1 y 5 estrellas")
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envía comentario opcional vacío como undefined", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    renderModal({ onSubmit });

    await user.click(screen.getByRole("radio", { name: "4 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Publicar reseña" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ rating: 4, comment: undefined });
    });
  });

  it("mantiene la selección si el envío falla", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(false);
    renderModal({ onSubmit });

    await user.click(screen.getByRole("radio", { name: "3 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Publicar reseña" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    expect(
      screen.getByRole("radio", { name: "3 estrellas" })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("deshabilita el formulario mientras se envía", () => {
    const onSubmit = vi.fn();
    renderModal({ onSubmit, submitting: true });

    expect(screen.getByRole("button", { name: "Publicando…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "5 estrellas" })).toBeDisabled();
  });
});