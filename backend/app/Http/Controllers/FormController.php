<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $forms = $request->user()->forms()->latest()->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'forms' => $forms,
                ],
                'message' => 'Forms retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve forms',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'structure' => 'required|array',
            ]);

            $form = $request->user()->forms()->create([
                'title' => $request->title,
                'description' => $request->description,
                'structure' => $request->structure,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'form' => $form,
                ],
                'message' => 'Form created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        try {
            $form = $request->user()->forms()->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'form' => $form,
                ],
                'message' => 'Form retrieved successfully',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $form = $request->user()->forms()->findOrFail($id);

            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'sometimes|nullable|string',
                'structure' => 'required|array',
            ]);

            $form->update($request->only(['title', 'description', 'structure']));

            return response()->json([
                'success' => true,
                'data' => [
                    'form' => $form,
                ],
                'message' => 'Form updated successfully',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $form = $request->user()->forms()->findOrFail($id);
            $form->delete();

            return response()->json([
                'success' => true,
                'message' => 'Form deleted successfully',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
