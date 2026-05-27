/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'urgente' | 'alta' | 'media' | 'baja';
  type: 'DIY' | 'Tareas';
  status: 'en curso' | 'hecho';
  progress?: number;
  dueDate?: string;
  dueTime?: string;
  // DIY specific fields
  materials?: { name: string; checked: boolean }[];
  steps?: { title: string; description: string }[];
  gallery?: { type: 'image' | 'video'; url: string }[];
  bannerImage?: string;
  resources?: { title: string; type: 'video' | 'pdf'; url: string }[];
}

export interface Material {
  id: number;
  name: string;
  description: string;
  category: string;
  have: number;
  need: number;
  unit: string;
  shortUnit: string;
  location: string;
  image: string;
  price?: number;
  buyStatus?: 'para comprar' | 'aplazado' | 'no comprar';
}
